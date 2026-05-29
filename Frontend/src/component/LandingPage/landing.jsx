import React from 'react';
import { Link } from 'react-router-dom';
import { FaPen, FaUsers, FaRocket, FaComments, FaHeart, FaShare } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="apple-landing">
      {/* Navigation */}
      <nav className="apple-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>BlogAI</h1>
          </div>
          <div className="nav-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/signin" className="nav-link">Sign In</Link>
            <Link to="/signup" className="nav-button">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Write. Share. <span className="highlight">Inspire.</span>
            </h1>
            <p className="hero-subtitle">
              The most beautiful way to share your thoughts with the world.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="apple-button primary">
                Get Started
              </Link>
              <Link to="/about" className="apple-button secondary">
                Learn more
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-container">
              <div className="floating-card">
                <FaPen className="card-icon" />
                <span>Write</span>
              </div>
              <div className="floating-card">
                <FaUsers className="card-icon" />
                <span>Connect</span>
              </div>
              <div className="floating-card">
                <FaRocket className="card-icon" />
                <span>Grow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Designed for writers.</h2>
            <p>Everything you need to create, share, and grow your audience.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <FaPen />
              </div>
              <h3>Beautiful Writing</h3>
              <p>Focus on your words while we handle the design. Clean, distraction-free editor that makes writing a joy.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <FaComments />
              </div>
              <h3>Real Connections</h3>
              <p>Build meaningful relationships with your readers through thoughtful conversations and community.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <FaRocket />
              </div>
              <h3>AI-Powered</h3>
              <p>Get intelligent suggestions, editing help, and content ideas from our advanced AI assistant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Writers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Stories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Readers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfied</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Start your story today.</h2>
            <p>Join thousands of writers sharing their thoughts on BlogAI.</p>
            <Link to="/signup" className="apple-button primary large">
              Create Your Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="apple-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>BlogAI</h3>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Platform</h4>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Community</h4>
                <ul>
                  <li><Link to="/signup">Join</Link></li>
                  <li><Link to="/signin">Sign In</Link></li>
                  <li><Link to="/addBlog">Write</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <ul>
                  <li><Link to="#">Help</Link></li>
                  <li><Link to="#">Privacy</Link></li>
                  <li><Link to="#">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 BlogAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}