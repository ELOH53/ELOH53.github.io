# Emrie Loh - Personal Portfolio Website

A professional portfolio website built with Jekyll, featuring personal information, coding projects, and teaching resources.

## Site Structure

- **Home** (`/`) - Landing page with overview of all sections
- **Personal Information** (`/personal.html`) - Name and resume
- **Coding Projects** (`/projects.html`) - Automatically displays GitHub repositories
- **Teaching Resources** (`/teaching.html`) - Links to educational materials

## Features

- Professional portfolio design with responsive layout
- Automatic GitHub project integration via GitHub API
- Mobile-friendly navigation
- Clean, modern UI with smooth transitions

## Setup

This site uses Jekyll and is configured for GitHub Pages. To run locally:

1. Install Jekyll: `gem install bundler jekyll`
2. Install dependencies: `bundle install`
3. Run the server: `bundle exec jekyll serve`
4. Visit: `http://localhost:4000`

## Customization

### Adding Your Resume

1. Upload your resume PDF to the repository (e.g., in an `assets` folder)
2. Update the resume link in `personal.html`:
   ```html
   <a href="/assets/resume.pdf" class="btn btn-primary">View Resume</a>
   ```

### Adding Teaching Resources

Edit `teaching.html` and add your resource links in the format:
```html
<div class="resource-item">
  <h3 class="resource-title">Resource Title</h3>
  <p class="resource-description">Description of the resource</p>
  <a href="https://example.com" class="resource-link" target="_blank" rel="noopener noreferrer">View Resource →</a>
</div>
```

### GitHub Projects

Projects are automatically fetched from your GitHub account (configured in `_config.yml` as `github_username: ELOH53`). The projects page will display all your public repositories.

## Configuration

Edit `_config.yml` to customize:
- Site title and description
- Navigation menu
- GitHub username for project fetching
