import React from "react";

export const Header = () => {
  return (
    <div className="container mt-3 mb-5">
      <section className="hero is-link">
        <div className="hero-body">
          <p className="title" data-testid="header-title">
            Link hero
          </p>
          <p className="subtitle" data-testid="header-body">
            Link subtitle
          </p>
        </div>
      </section>
    </div>
  );
};
