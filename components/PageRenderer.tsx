import {ContactBlock} from './blocks/ContactBlock';
import {DisciplinesGrid} from './blocks/DisciplinesGrid';
import {HeroCountdown} from './blocks/HeroCountdown';
import {PeopleGrid} from './blocks/PeopleGrid';
import {PostList} from './blocks/PostList';
import {Prizes} from './blocks/Prizes';
import {SponsorsGrid} from './blocks/SponsorsGrid';
import {Timeline} from './blocks/Timeline';
import {Testimonials} from './blocks/Testimonials';
import {ImageGallery} from './blocks/ImageGallery';
import {CtaButtons} from './blocks/CtaButtons';
import {Slideshow} from './blocks/Slideshow';
import {RichContent} from './blocks/RichContent';

import type {Block} from '@types/blocks';
import type {Post} from '@types/cms';
import type {Locale} from '@i18n/config';

type PostLookup = (limit?: number) => Promise<Post[]>;

export async function PageRenderer({
  blocks,
  locale,
  getPosts,
  tenantPath = ''
}: {
  blocks: Block[];
  locale: Locale;
  getPosts: PostLookup;
  tenantPath?: string;
}) {
  const resolvedBlocks = await Promise.all(
    blocks.map(async (block) => {
      if (block.type === 'post-list') {
        const posts = await getPosts(block.query?.limit);
        return {block, posts};
      }
      return {block};
    })
  );

  return (
    <main>
      {resolvedBlocks.map(({block, posts}, index) => {
        switch (block.type) {
          case 'hero-countdown':
            return <HeroCountdown key={index} block={block} />;
          case 'disciplines-grid':
            return <DisciplinesGrid key={index} block={block} />;
          case 'timeline':
            return <Timeline key={index} block={block} locale={locale} />;
          case 'prizes':
            return <Prizes key={index} block={block} />;
          case 'sponsors-grid':
            return <SponsorsGrid key={index} block={block} />;
          case 'people-grid':
            return <PeopleGrid key={index} block={block} />;
          case 'post-list':
            return posts ? (
              <PostList
                key={index}
                block={block}
                posts={posts}
                locale={locale}
                tenantPath={tenantPath}
              />
            ) : null;
          case 'contact':
            return <ContactBlock key={index} block={block} />;
          case 'testimonials':
            return <Testimonials key={index} block={block} />;
          case 'image-gallery':
            return <ImageGallery key={index} block={block} />;
          case 'cta-buttons':
            return <CtaButtons key={index} block={block} locale={locale} tenantPath={tenantPath} />;
          case 'slideshow':
            return <Slideshow key={index} block={block} locale={locale} tenantPath={tenantPath} />;
          case 'rich-content':
            return <RichContent key={index} block={block} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
