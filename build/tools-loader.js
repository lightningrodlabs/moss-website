// Tools Loader - Dynamically fetches and renders tools from weave-tool-curation repo

const CURATIONS_URL = 'https://raw.githubusercontent.com/lightningrodlabs/weave-tool-curation/main/0.15/lists/curations-0.15.json';

// Map from toolListUrl patterns to fetchable URLs
// The curations file references URLs that may differ from raw GitHub URLs
const TOOL_LIST_URL_MAP = {
    'lightningrodlabs.org/weave-tool-curation': 'https://raw.githubusercontent.com/lightningrodlabs/weave-tool-curation/main/0.15/lists/tool-list-0.15.json',
    'matthme/weave-tool-curation': 'https://raw.githubusercontent.com/matthme/weave-tool-curation/refs/heads/main/0.15/lists/tool-list-0.15.json',
    'unytco/unyt-moss': 'https://raw.githubusercontent.com/unytco/unyt-moss/refs/heads/main/0.15/lists/tool-list-0.15.json'
};

// Category mappings based on tags
// Order matters - more specific categories should come first
const CATEGORY_MAPPINGS = {
    'Communication': ['chat', 'video calls', 'screen sharing'],
    'Project Management': ['project-management', 'project management', 'kanban', 'task management', 'scheduling', 'calendar'],
    'Ideation & Decision Making': ['notes', 'stickies', 'ideation', 'boards', 'brainstorming', 'governance', 'decision making', 'problem-solving', 'convergent facilitation', 'nvc', 'dcan'],
    'Fun & Games': ['games', 'entertainment', 'tabletop'],
    'Collaboration & Documents': ['documents', 'editor', 'markdown', 'real-time editor', 'file', 'storage', 'file sharing', 'spreadsheet', 'spreadsheets', 'drawing', 'whiteboard', 'collaborative text editing'],
    'Experimental': ['conference', 'community-currency', 'accounting', 'mutual-credit', 'payment systems', 'testing', 'supply chain', 'hREA', 'data', 'management']
};

// Tools that should be in the experimental section (low visibility)
const EXPERIMENTAL_TOOL_IDS = ['emergence', 'unyt', 'acfn', 'datatub'];

// Special handling for tool IDs that may have prefixes
function normalizeToolId(toolId) {
    // Handle namespaced IDs like "matthme.presence" -> "presence"
    if (toolId.includes('.')) {
        return toolId.split('.').pop();
    }
    return toolId;
}

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.json();
}

function getToolListFetchUrl(toolListUrl) {
    // Find matching pattern and return the fetchable URL
    for (const [pattern, fetchUrl] of Object.entries(TOOL_LIST_URL_MAP)) {
        if (toolListUrl.includes(pattern)) {
            return fetchUrl;
        }
    }
    // If no pattern matches, try using the URL directly (might work for raw GitHub URLs)
    return toolListUrl;
}

function categorizeToolByTags(tags, toolId) {
    // Check if it's an experimental tool first (normalize the ID)
    const normalizedId = normalizeToolId(toolId);
    if (EXPERIMENTAL_TOOL_IDS.includes(normalizedId)) {
        return 'Experimental';
    }

    const lowerTags = tags.map(t => t.toLowerCase());

    for (const [category, categoryTags] of Object.entries(CATEGORY_MAPPINGS)) {
        if (category === 'Experimental') continue; // Skip, handled above
        for (const tag of lowerTags) {
            if (categoryTags.includes(tag)) {
                return category;
            }
        }
    }

    return 'Other';
}

function createToolCard(tool, isExperimental = false) {
    const card = document.createElement('div');
    card.className = `tool-card${isExperimental ? ' tool-card-experimental' : ''}`;

    const tagsHtml = (tool.tags || [])
        .filter(t => t && t.trim())
        .slice(0, 3)
        .map(tag => `<span class="tool-tag">${escapeHtml(tag)}</span>`)
        .join('');

    card.innerHTML = `
        <div class="tool-icon">
            <img src="${escapeHtml(tool.icon)}" alt="${escapeHtml(tool.title)}" onerror="this.style.display='none'"/>
        </div>
        <div class="tool-info">
            <h3 class="tool-title">${escapeHtml(tool.title)}</h3>
            <p class="tool-subtitle">${escapeHtml(tool.subtitle || '')}</p>
            <p class="tool-description">${escapeHtml(tool.description || '')}</p>
            <div class="tool-tags">${tagsHtml}</div>
        </div>
    `;

    return card;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function createCategorySection(categoryName, tools, isExperimental = false) {
    const section = document.createElement('div');
    section.className = `tools-category${isExperimental ? ' tools-experimental' : ''}`;

    let headerHtml = `<h2 class="category-heading">${escapeHtml(categoryName)}</h2>`;
    if (isExperimental) {
        headerHtml += `<p class="category-description">These tools are in early development and may have limited functionality.</p>`;
    }

    section.innerHTML = headerHtml;

    const grid = document.createElement('div');
    grid.className = 'tools-grid';

    tools.forEach(tool => {
        grid.appendChild(createToolCard(tool, isExperimental));
    });

    section.appendChild(grid);
    return section;
}

async function loadTools() {
    const container = document.getElementById('tools-container');

    try {
        // Show loading state
        container.innerHTML = '<div class="tools-loading">Loading tools from the community...</div>';

        // Fetch curations to get the list of tools
        const curations = await fetchJSON(CURATIONS_URL);
        const curatedTools = curations.curationLists.default.tools;

        // Determine which tool list URLs we need to fetch
        const toolListUrlsToFetch = new Set();
        const originalToFetchUrl = new Map(); // Map original URL -> fetch URL

        curatedTools.forEach(tool => {
            const fetchUrl = getToolListFetchUrl(tool.toolListUrl);
            toolListUrlsToFetch.add(fetchUrl);
            originalToFetchUrl.set(tool.toolListUrl, fetchUrl);
        });

        // Fetch all required tool lists in parallel
        const toolListPromises = Array.from(toolListUrlsToFetch).map(async fetchUrl => {
            const data = await fetchJSON(fetchUrl);
            return { fetchUrl, data };
        });

        const toolListResults = await Promise.all(toolListPromises);

        // Build a lookup map of tool details, keyed by fetch URL + tool id + version
        const toolDetailsMap = {};
        toolListResults.forEach(({ fetchUrl, data }) => {
            data.tools.forEach(tool => {
                const lookupKey = `${fetchUrl}:${tool.id}:${tool.versionBranch}`;
                toolDetailsMap[lookupKey] = tool;
            });
        });

        // Process curated tools, keeping only the latest version of each tool
        const seenTools = new Map(); // normalizedToolId -> { tool, versionBranch }

        curatedTools.forEach(curatedTool => {
            const fetchUrl = originalToFetchUrl.get(curatedTool.toolListUrl);
            const lookupKey = `${fetchUrl}:${curatedTool.toolId}:${curatedTool.versionBranch}`;
            const toolDetails = toolDetailsMap[lookupKey];

            if (!toolDetails) return;

            // Skip deprecated tools
            if (toolDetails.deprecation) return;

            // Use normalized ID for deduplication (e.g., "matthme.presence" -> "presence")
            const normalizedId = normalizeToolId(curatedTool.toolId);
            const existingTool = seenTools.get(normalizedId);

            if (!existingTool) {
                seenTools.set(normalizedId, {
                    ...toolDetails,
                    originalId: curatedTool.toolId,
                    curatedTags: curatedTool.tags,
                    visibility: curatedTool.visiblity // note: typo in source data
                });
            } else {
                // Compare version branches to keep the latest
                const existingVersion = parseFloat(existingTool.versionBranch) || 0;
                const newVersion = parseFloat(curatedTool.versionBranch) || 0;

                if (newVersion > existingVersion) {
                    seenTools.set(normalizedId, {
                        ...toolDetails,
                        originalId: curatedTool.toolId,
                        curatedTags: curatedTool.tags,
                        visibility: curatedTool.visiblity
                    });
                }
            }
        });

        // Categorize tools
        const categories = {};

        seenTools.forEach((tool, toolId) => {
            const allTags = [...(tool.tags || []), ...(tool.curatedTags || [])];
            const category = categorizeToolByTags(allTags, toolId);

            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(tool);
        });

        // Clear container and render categories in order
        container.innerHTML = '';

        const categoryOrder = [
            'Communication',
            'Collaboration & Documents',
            'Project Management',
            'Ideation & Decision Making',
            'Fun & Games',
            'Other',
            'Experimental'
        ];

        categoryOrder.forEach(categoryName => {
            const tools = categories[categoryName];
            if (tools && tools.length > 0) {
                const isExperimental = categoryName === 'Experimental';
                container.appendChild(createCategorySection(categoryName, tools, isExperimental));
            }
        });

    } catch (error) {
        console.error('Failed to load tools:', error);
        container.innerHTML = `
            <div class="tools-error">
                <p>Unable to load tools at the moment.</p>
                <p>Please try again later or visit the <a href="https://github.com/lightningrodlabs/weave-tool-curation">tool curation repository</a> directly.</p>
            </div>
        `;
    }
}

// Load tools when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTools);
} else {
    loadTools();
}
