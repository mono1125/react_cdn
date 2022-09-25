import { FC } from 'react'

export const Header: FC = () => {
  const title = 'Title'
  const body = 'Body'

  return (
    <div className="container mt-3 mb-5">
      <section className="hero is-link">
        <div className="hero-body">
          <p className="title" data-testid="header-title">
            {title}
          </p>
          <p className="subtitle" data-testid="header-body">
            {body}
          </p>
        </div>
      </section>
    </div>
  )
}
