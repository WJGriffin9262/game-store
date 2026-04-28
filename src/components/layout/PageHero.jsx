import LayoutContainer from './LayoutContainer';

/**
 * Reusable top band for page titles (BEM: page-hero, page-hero__*).
 */
export default function PageHero({
  title,
  description,
  headingTag: HeadingTag = 'h1',
  headingId,
  actions = null,
}) {
  const textBlock = (
    <>
      <HeadingTag id={headingId} className='page-hero__heading heading-display'>
        {title}
      </HeadingTag>
      {description ? <p className='page-hero__text'>{description}</p> : null}
    </>
  );

  return (
    <div className='page-hero'>
      <LayoutContainer>
        {actions ? (
          <div className='page-hero__row'>
            {textBlock}
            <div className='page-hero__actions'>{actions}</div>
          </div>
        ) : (
          textBlock
        )}
      </LayoutContainer>
    </div>
  );
}
