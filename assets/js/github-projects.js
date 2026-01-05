// GitHub Projects Integration
(function() {
  const GITHUB_USERNAME = 'ELOH53';
  const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
  
  let allProjects = [];
  let filteredProjects = [];
  
  // Fetch projects from GitHub API
  async function fetchProjects() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const projectsGrid = document.getElementById('projects-grid');
    
    try {
      loadingEl.style.display = 'block';
      errorEl.style.display = 'none';
      projectsGrid.innerHTML = '';
      
      const response = await fetch(GITHUB_API_URL, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const repos = await response.json();
      
      // Filter out forks (optional - you can remove this if you want to include forks)
      allProjects = repos
        .filter(repo => !repo.fork || repo.name === GITHUB_USERNAME.toLowerCase() + '.github.io')
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      
      filteredProjects = [...allProjects];
      
      // Populate language filter
      populateLanguageFilter();
      
      // Display projects
      displayProjects(filteredProjects);
      
      loadingEl.style.display = 'none';
    } catch (error) {
      console.error('Error fetching projects:', error);
      loadingEl.style.display = 'none';
      errorEl.style.display = 'block';
      projectsGrid.innerHTML = '';
    }
  }
  
  // Populate language filter dropdown
  function populateLanguageFilter() {
    const languageFilter = document.getElementById('language-filter');
    const languages = new Set();
    
    allProjects.forEach(project => {
      if (project.language) {
        languages.add(project.language);
      }
    });
    
    // Clear existing options except "All Languages"
    languageFilter.innerHTML = '<option value="">All Languages</option>';
    
    // Add language options
    Array.from(languages).sort().forEach(language => {
      const option = document.createElement('option');
      option.value = language;
      option.textContent = language;
      languageFilter.appendChild(option);
    });
  }
  
  // Display projects in the grid
  function displayProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
      projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">No projects found.</p>';
      return;
    }
    
    projectsGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');
  }
  
  // Create project card HTML
  function createProjectCard(project) {
    const description = project.description || 'No description available';
    const language = project.language || 'Other';
    const stars = project.stargazers_count || 0;
    const forks = project.forks_count || 0;
    const updated = new Date(project.updated_at).toLocaleDateString();
    
    // Check if there's a GitHub Pages site
    const hasPages = project.has_pages;
    const pagesUrl = hasPages ? `https://${GITHUB_USERNAME.toLowerCase()}.github.io/${project.name}` : null;
    
    return `
      <div class="project-card">
        <div class="project-header">
          <div>
            <h3 class="project-name">
              <a href="${project.html_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.name)}</a>
            </h3>
          </div>
        </div>
        <p class="project-description">${escapeHtml(description)}</p>
        <div class="project-meta">
          <span class="project-language">${escapeHtml(language)}</span>
        </div>
        <div class="project-stats">
          <span>⭐ ${stars}</span>
          <span>🍴 ${forks}</span>
          <span>Updated: ${updated}</span>
        </div>
        <div class="project-links">
          <a href="${project.html_url}" class="project-link" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
          ${pagesUrl ? `<a href="${pagesUrl}" class="project-link" target="_blank" rel="noopener noreferrer">Live Demo →</a>` : ''}
        </div>
      </div>
    `;
  }
  
  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Filter projects by search term
  function filterBySearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      filteredProjects = [...allProjects];
    } else {
      filteredProjects = allProjects.filter(project => {
        const name = project.name.toLowerCase();
        const description = (project.description || '').toLowerCase();
        const language = (project.language || '').toLowerCase();
        
        return name.includes(term) || description.includes(term) || language.includes(term);
      });
    }
    
    applyLanguageFilter();
  }
  
  // Filter projects by language
  function filterByLanguage(language) {
    applyLanguageFilter();
  }
  
  // Apply language filter to already filtered projects
  function applyLanguageFilter() {
    const languageFilter = document.getElementById('language-filter');
    const selectedLanguage = languageFilter.value;
    
    if (!selectedLanguage) {
      displayProjects(filteredProjects);
      return;
    }
    
    const languageFiltered = filteredProjects.filter(project => 
      project.language === selectedLanguage
    );
    
    displayProjects(languageFiltered);
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Fetch projects
    fetchProjects();
    
    // Setup search
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        filterBySearch(e.target.value);
      });
    }
    
    // Setup language filter
    const languageFilter = document.getElementById('language-filter');
    if (languageFilter) {
      languageFilter.addEventListener('change', function(e) {
        filterByLanguage(e.target.value);
      });
    }
  });
})();
