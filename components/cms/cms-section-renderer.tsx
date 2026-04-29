import {
  CMS_SECTION_BODY_LINES,
  CMS_SECTION_HEADING_LINES,
  CmsClamp,
  cmsClampClassNames,
} from '@/components/ui/cms-clamp';
import { HeroSection } from '@/components/home/hero-section';
import { PartnersBar } from '@/components/home/partners-bar';
import { ServicesSection } from '@/components/home/services-section';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { OurTrades } from '@/components/home/our-trades';
import { HowItWorks } from '@/components/home/how-it-works';
import { OurWorks } from '@/components/home/our-works';
import { ServiceLocations } from '@/components/home/service-locations';
import { CTASection } from '@/components/home/cta-section';
import { SplitCellGridSection } from '@/components/home/split-cell-grid-section';
import { ThreeColumnTextSection } from '@/components/home/three-column-text-section';
import { ZigzagLabeledFeaturesSection } from '@/components/home/zigzag-labeled-features-section';
import { CmsTestimonialsSection } from '@/components/home/cms-testimonials-section';
import { CmsFaqGridSection } from '@/components/home/cms-faq-grid-section';
import { SiteTradeHeroSection } from '@/components/cms/site-trade-hero-section';
import { SiteTradeLowerSection } from '@/components/cms/site-trade-lower-section';
import { SiteServiceMarketingHero } from '@/components/cms/site-service-marketing-hero';
import { SiteLinePairGridSection } from '@/components/cms/site-line-pair-grid-section';
import { SiteTagCloudRowSection } from '@/components/cms/site-tag-cloud-row-section';
import { SiteStackedTagRowsSection } from '@/components/cms/site-stacked-tag-rows-section';
import { SiteOfferingsGridSection } from '@/components/cms/site-offerings-grid-section';
import { SiteHorizontalPillsSection } from '@/components/cms/site-horizontal-pills-section';
import { SiteTitleDescriptionMatrixSection } from '@/components/cms/site-title-description-matrix-section';
import { SiteMultilineItemGridSection } from '@/components/cms/site-multiline-item-grid-section';
import { SiteDarkProseSection } from '@/components/cms/site-dark-prose-section';
import { SiteServiceTradesFooterSection } from '@/components/cms/site-service-trades-footer-section';
import { cmsLinkToPair, cmsStateLinkHref, coerceCmsLinkField } from '@/lib/cms-sections/cms-link';
import {
  cmsResolveHeadlineSize,
  cmsResolveParagraphSize,
} from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';
import { normalizeStateCodeFromCms } from '@/lib/us-states';
import {
  migrateLegacyCmsSection,
  normalizeCarouselServices,
} from '@/lib/cms-sections/legacy-map';
import { SITE_SECTION_TYPES } from '@/lib/cms-sections/registry';
import type { CmsPageSection } from '@/lib/cms-sections/types';
import type { HomeServiceItem } from '@/components/home/services-section';

type RendererProps = {
  sections: CmsPageSection[];
};

function optionalHrefFromCmsLink(link: unknown): string | undefined {
  if (!link || typeof link !== 'object') {
    return undefined;
  }
  const raw = String((link as { href?: string }).href ?? '').trim();
  if (!raw) {
    return undefined;
  }
  return cmsStateLinkHref(link);
}

function clampGridDim(n: unknown): number {
  const v = parseInt(String(n ?? '2'), 10);
  if (!Number.isFinite(v)) {
    return 2;
  }
  return Math.min(8, Math.max(2, v));
}

function cmsHeadlineTy(data: Record<string, unknown>, baseKey: string) {
  return cmsResolveHeadlineSize(data[`${baseKey}Size`], data[`${baseKey}FontSizePx`]);
}

function cmsParagraphTy(data: Record<string, unknown>, baseKey: string) {
  return cmsResolveParagraphSize(data[`${baseKey}Size`], data[`${baseKey}FontSizePx`]);
}

function splitCellContainerWidth(d: Record<string, unknown>): string {
  const w = String(d.containerWidth ?? 'narrow');
  if (w === 'wide') {
    return 'max-w-5xl';
  }
  if (w === 'wider') {
    return 'max-w-6xl';
  }
  return 'max-w-3xl';
}

export async function CmsPageSections({ sections }: RendererProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const needsLive = sorted.some((section) => {
    const migrated = migrateLegacyCmsSection(section);
    if (migrated.type !== 'site_services_carousel') {
      return false;
    }
    const raw = migrated.data;
    const d =
      raw && typeof raw === 'object' && !Array.isArray(raw)
        ? (raw as Record<string, unknown>)
        : {};
    return String(d.useLiveServices ?? 'false') === 'true';
  });

  let liveServices: HomeServiceItem[] | undefined;
  if (needsLive) {
    const { getLiveServicesForCarousel } = await import('@/lib/service-nav');
    liveServices = await getLiveServicesForCarousel();
  }

  return (
    <div className="cms-page-sections">
      {sorted.map((section) => (
        <CmsSectionBlock key={section.key} section={section} liveServices={liveServices} />
      ))}
    </div>
  );
}

function CmsSectionBlock({
  section,
  liveServices,
}: {
  section: CmsPageSection;
  liveServices?: HomeServiceItem[];
}) {
  const migrated = migrateLegacyCmsSection(section);
  if (!SITE_SECTION_TYPES.has(migrated.type)) {
    return null;
  }

  const d =
    migrated.data && typeof migrated.data === 'object' && !Array.isArray(migrated.data)
      ? (migrated.data as Record<string, unknown>)
      : {};

  switch (migrated.type) {
    case 'site_hero': {
      const sub = String(d.subtitle ?? '').trim();
      const head = String(d.headline || '').trim();
      return (
        <HeroSection
          headline={head || undefined}
          subtitle={sub ? sub : undefined}
          primaryCta={cmsLinkToPair(d.primaryCta, {
            href: '/services',
            label: 'Explore Services',
          })}
          secondaryCta={cmsLinkToPair(d.secondaryCta, {
            href: '/contact',
            label: 'Get a Quote',
          })}
          imageSrc={String(d.imageSrc || '').trim() || undefined}
          imageAlt={String(d.imageAlt || '').trim() || undefined}
          headlineTypography={head ? cmsHeadlineTy(d, 'headline') : undefined}
          subtitleTypography={cmsParagraphTy(d, 'subtitle')}
        />
      );
    }

    case 'site_partners': {
      const logosRaw = Array.isArray(d.logos) ? d.logos : [];
      const logos = logosRaw.map((raw) => {
        const L = raw as Record<string, string>;
        const width = parseInt(String(L.width || ''), 10);
        const height = parseInt(String(L.height || ''), 10);
        return {
          src: String(L.src || ''),
          alt: String(L.alt || 'Partner'),
          ...(Number.isFinite(width) ? { width } : {}),
          ...(Number.isFinite(height) ? { height } : {}),
        };
      }).filter((l) => l.src);
      return (
        <PartnersBar
          intro={String(d.intro || '').trim() || undefined}
          logos={logos.length ? logos : undefined}
          introTypography={cmsParagraphTy(d, 'intro')}
        />
      );
    }

    case 'site_services_carousel': {
      const explore = cmsLinkToPair(d.exploreCta, {
        href: '/services',
        label: 'Explore All Services',
      });
      const introRaw = String(d.intro ?? '').trim();
      const introProp = introRaw ? introRaw : undefined;
      const useLive = String(d.useLiveServices ?? 'false') === 'true';
      const sectionTitleTy = cmsHeadlineTy(d, 'sectionTitle');
      const introTy = cmsParagraphTy(d, 'intro');
      if (useLive && liveServices && liveServices.length > 0) {
        return (
          <ServicesSection
            services={liveServices}
            sectionTitle={String(d.sectionTitle || 'Services')}
            intro={introProp}
            exploreHref={explore.href}
            exploreLabel={explore.label}
            sectionTitleTypography={sectionTitleTy}
            introTypography={introTy}
          />
        );
      }
      const services = normalizeCarouselServices(d.services);
      if (services.length === 0) {
        return (
          <ServicesSection
            sectionTitle={String(d.sectionTitle || 'Services')}
            intro={introProp}
            exploreHref={explore.href}
            exploreLabel={explore.label}
            sectionTitleTypography={sectionTitleTy}
            introTypography={introTy}
          />
        );
      }
      return (
        <ServicesSection
          services={services}
          sectionTitle={String(d.sectionTitle || 'Services')}
          intro={introProp}
          exploreHref={explore.href}
          exploreLabel={explore.label}
          sectionTitleTypography={sectionTitleTy}
          introTypography={introTy}
        />
      );
    }

    case 'site_why_choose_us': {
      const statsRaw = Array.isArray(d.stats) ? d.stats : [];
      const stats = statsRaw.map((raw) => {
        const s = raw as Record<string, string>;
        return { value: String(s.value || ''), label: String(s.label || '') };
      }).filter((s) => s.value);
      return (
        <WhyChooseUs
          heading={String(d.heading || '').trim() || undefined}
          stats={stats.length ? stats : undefined}
          headingTypography={cmsHeadlineTy(d, 'heading')}
        />
      );
    }

    case 'site_trades_grid': {
      const tradesRaw = Array.isArray(d.trades) ? d.trades : [];
      const trades = tradesRaw.map((raw) => {
        const t = raw as Record<string, string>;
        return {
          title: String(t.title || '').replace(/\\n/g, '\n'),
          description: String(t.description || ''),
          href: t.href?.startsWith('/') ? t.href : `/${t.href || 'trades'}`,
          arrowColor: String(t.arrowColor || '#EA7E37'),
          topColor: String(t.topColor || '#E27B36'),
          layerColor: String(t.layerColor || '#8D5530'),
        };
      }).filter((t) => t.title);
      return (
        <OurTrades
          heading={String(d.heading || '').trim() || undefined}
          intro={String(d.intro || '').trim() || undefined}
          trades={trades.length ? trades : undefined}
          theme={d.theme === 'dark' ? 'dark' : 'default'}
          headingTypography={cmsHeadlineTy(d, 'heading')}
          introTypography={cmsParagraphTy(d, 'intro')}
        />
      );
    }

    case 'site_how_it_works': {
      const lines = String(d.stepsLines || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      return (
        <HowItWorks
          heading={String(d.heading || '').trim() || undefined}
          steps={lines.length ? lines : undefined}
          variant={d.variant === 'dark' ? 'dark' : 'light'}
          headingTypography={cmsHeadlineTy(d, 'heading')}
        />
      );
    }

    case 'site_our_works': {
      const worksRaw = Array.isArray(d.works) ? d.works : [];
      const works = worksRaw.map((raw) => {
        const w = raw as Record<string, string>;
        return {
          src: String(w.src || ''),
          alt: String(w.alt || ''),
          title: String(w.title || ''),
        };
      }).filter((w) => w.src);
      const explore = cmsLinkToPair(d.exploreCta, {
        href: '/our-works',
        label: 'Explore More',
      });
      return (
        <OurWorks
          heading={String(d.heading || '').trim() || undefined}
          intro={String(d.intro || '').trim() || undefined}
          works={works.length ? works : undefined}
          exploreHref={explore.href}
          exploreLabel={explore.label}
          headingTypography={cmsHeadlineTy(d, 'heading')}
          introTypography={cmsParagraphTy(d, 'intro')}
        />
      );
    }

    case 'site_service_locations': {
      const stateHrefs: Record<string, string> = {};
      const rows = Array.isArray(d.stateLinks) ? d.stateLinks : [];
      for (const raw of rows) {
        const row = raw as Record<string, unknown>;
        const code = normalizeStateCodeFromCms(row.state);
        if (!code) {
          continue;
        }
        stateHrefs[code] = cmsStateLinkHref(coerceCmsLinkField(row.target));
      }
      return (
        <ServiceLocations
          heading={String(d.heading || '').trim() || undefined}
          subtitle={String(d.subtitle || '').trim() || undefined}
          stateHrefs={Object.keys(stateHrefs).length ? stateHrefs : undefined}
          headingTypography={cmsHeadlineTy(d, 'heading')}
          subtitleTypography={cmsParagraphTy(d, 'subtitle')}
        />
      );
    }

    case 'site_cta': {
      const cta = cmsLinkToPair(d.cta, { href: '/contact', label: 'Get a Quote' });
      const variant = d.variant === 'default' ? 'default' : 'dark';
      return (
        <CTASection
          variant={variant}
          title={String(d.title || '').trim() || undefined}
          description={String(d.description || '').trim() || undefined}
          ctaHref={cta.href}
          ctaLabel={cta.label}
          titleTypography={cmsHeadlineTy(d, 'title')}
          descriptionTypography={cmsParagraphTy(d, 'description')}
        />
      );
    }

    case 'site_prose': {
      const heading = String(d.heading || '').trim();
      const body = String(d.body || '');
      const paragraphs = body.split(/\n\s*\n/).filter(Boolean);
      const headingTy = cmsHeadlineTy(d, 'heading');
      const bodyTy = cmsParagraphTy(d, 'body');
      return (
        <section className="bg-background py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            {heading ? (
              <h2
                className={cn(
                  'mb-6 text-center text-3xl font-bold text-foreground md:text-4xl',
                  headingTy?.className,
                )}
                style={headingTy?.style}
              >
                <CmsClamp as="span" lines={CMS_SECTION_HEADING_LINES}>
                  {heading}
                </CmsClamp>
              </h2>
            ) : null}
            <div
              className={cn(
                'space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base',
                bodyTy?.className,
              )}
              style={bodyTy?.style}
            >
              {paragraphs.map((p, i) => (
                <p key={i} className={cn('whitespace-pre-line', cmsClampClassNames(6))}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'site_split_cell_grid': {
      const cellRows = Array.isArray(d.cells) ? d.cells : [];
      const cells = cellRows.map((row) =>
        String((row as Record<string, unknown>).text ?? '').trim(),
      );
      return (
        <SplitCellGridSection
          heading={String(d.heading || '').trim() || undefined}
          intro={String(d.intro || '').trim() || undefined}
          rows={clampGridDim(d.gridRows)}
          cols={clampGridDim(d.gridCols)}
          cells={cells}
          maxWidthClassName={splitCellContainerWidth(d)}
          headingTypography={cmsHeadlineTy(d, 'heading')}
          introTypography={cmsParagraphTy(d, 'intro')}
        />
      );
    }

    case 'site_three_column_text': {
      const raw = Array.isArray(d.blurbs) ? d.blurbs : [];
      const blurbs = raw
        .map((row) => String((row as Record<string, unknown>).text ?? '').trim())
        .filter(Boolean);
      const columnCount = parseInt(String(d.columnCount ?? '3'), 10) || 3;
      return (
        <ThreeColumnTextSection
          heading={String(d.heading || '').trim() || undefined}
          columns={columnCount}
          items={blurbs}
          headingTypography={cmsHeadlineTy(d, 'heading')}
        />
      );
    }

    case 'site_zigzag_features': {
      const raw = Array.isArray(d.features) ? d.features : [];
      const features = raw
        .map((row) => {
          const R = row as Record<string, unknown>;
          return {
            label: String(R.label ?? '').trim(),
            title: String(R.title ?? '').trim(),
            description: String(R.description ?? '').trim(),
            labelHref: optionalHrefFromCmsLink(R.labelLink),
          };
        })
        .filter((item) => item.label && item.title);
      return (
        <ZigzagLabeledFeaturesSection
          heading={String(d.heading || '').trim() || undefined}
          intro={String(d.intro || '').trim() || undefined}
          items={features}
          headingTypography={cmsHeadlineTy(d, 'heading')}
          introTypography={cmsParagraphTy(d, 'intro')}
        />
      );
    }

    case 'site_testimonials': {
      const raw = Array.isArray(d.testimonials) ? d.testimonials : [];
      const testimonials = raw
        .map((row) => {
          const R = row as Record<string, unknown>;
          const rating = Math.min(
            5,
            Math.max(0, parseInt(String(R.rating ?? '0'), 10) || 0),
          );
          return {
            name: String(R.name ?? '').trim(),
            text: String(R.quote ?? '').trim(),
            rating,
          };
        })
        .filter((t) => t.name || t.text);
      return (
        <CmsTestimonialsSection
          heading={String(d.heading || '').trim() || undefined}
          subtitle={String(d.subtitle || '').trim() || undefined}
          testimonials={testimonials}
          headingTypography={cmsHeadlineTy(d, 'heading')}
          subtitleTypography={cmsParagraphTy(d, 'subtitle')}
        />
      );
    }

    case 'site_faq_grid': {
      const raw = Array.isArray(d.faqItems) ? d.faqItems : [];
      const faqItems = raw
        .map((row) => {
          const R = row as Record<string, unknown>;
          return {
            question: String(R.question ?? '').trim(),
            answer: String(R.answer ?? '').trim(),
          };
        })
        .filter((f) => f.question && f.answer);
      return (
        <CmsFaqGridSection
          heading={String(d.heading || '').trim() || undefined}
          items={faqItems}
          headingTypography={cmsHeadlineTy(d, 'heading')}
        />
      );
    }

    case 'site_service_marketing_hero': {
      const fcRaw = Array.isArray(d.floatingCards) ? d.floatingCards : [];
      const floatingCards = fcRaw.map((row) => {
        const R = row as Record<string, string>;
        return {
          title: String(R.title ?? '').trim(),
          top: String(R.top ?? '').trim() || '0%',
          right: String(R.right ?? '').trim() || undefined,
          left: String(R.left ?? '').trim() || undefined,
          rotate: String(R.rotate ?? '0').trim() || '0',
        };
      }).filter((c) => c.title);
      return (
        <SiteServiceMarketingHero
          breadcrumbParentHref={String(d.breadcrumbParentHref || '/services').trim() || '/services'}
          breadcrumbParentLabel={String(d.breadcrumbParentLabel || 'Services').trim() || 'Services'}
          breadcrumbCurrent={String(d.breadcrumbCurrent || '').trim()}
          headlineHtml={String(d.headlineHtml || '').trim()}
          intro={String(d.intro || '').trim() || undefined}
          headlineTypography={cmsHeadlineTy(d, 'headlineHtml')}
          introTypography={cmsParagraphTy(d, 'intro')}
          layout={
            d.layout === 'cost'
              ? 'cost'
              : d.layout === 'marketing_split_centered'
                ? 'marketing_split_centered'
                : 'marketing_split'
          }
          rightVisual={
            d.rightVisual === 'image'
              ? 'image'
              : d.rightVisual === 'floating_cards'
                ? 'floating_cards'
                : d.rightVisual === 'construction_svg'
                  ? 'construction_svg'
                  : 'none'
          }
          imageSrc={String(d.imageSrc || '').trim() || undefined}
          imageAlt={String(d.imageAlt || '').trim() || undefined}
          imageClassName={String(d.imageClassName || '').trim() || undefined}
          imageWrapperClassName={String(d.imageWrapperClassName || '').trim() || undefined}
          glowPrimary={String(d.glowPrimary || '').trim() || undefined}
          glowSecondary={String(d.glowSecondary || '').trim() || undefined}
          glowTertiary={String(d.glowTertiary || '').trim() || undefined}
          floatingCards={floatingCards.length ? floatingCards : undefined}
        />
      );
    }

    case 'site_trade_hero': {
      return (
        <SiteTradeHeroSection
          breadcrumbCurrent={String(d.breadcrumbCurrent || '').trim()}
          headlineHtml={String(d.headlineHtml || '').trim()}
          intro={String(d.intro || '').trim()}
          hexTopColor={String(d.hexTopColor || '#8A6AB8').trim()}
          hexLayerColor={String(d.hexLayerColor || '#5A4080').trim()}
          iconId={String(d.iconId || 'trade-hero-icon').trim()}
          headlineTypography={cmsHeadlineTy(d, 'headlineHtml')}
          introTypography={cmsParagraphTy(d, 'intro')}
        />
      );
    }

    case 'site_trade_lower': {
      const gp = String(d.glowPrimary ?? '').trim();
      const gs = String(d.glowSecondary ?? '').trim();
      const gt = String(d.glowTertiary ?? '').trim();
      const glowColors =
        gp && gs && gt
          ? { primary: gp, secondary: gs, tertiary: gt }
          : undefined;

      const whyRaw = Array.isArray(d.whyItems) ? d.whyItems : [];
      const whyItems = whyRaw
        .map((row) => String((row as Record<string, unknown>).text ?? '').trim())
        .filter(Boolean);

      const typesRaw = Array.isArray(d.types) ? d.types : [];
      const types = typesRaw
        .map((row) => {
          const R = row as Record<string, string>;
          return {
            label: String(R.label ?? '').trim(),
            labelLinkHref: String(R.labelLinkHref ?? '').trim() || undefined,
            title: String(R.title ?? '').trim(),
            description: String(R.description ?? '').trim(),
            titleLinkHref: String(R.titleLinkHref ?? '').trim() || undefined,
          };
        })
        .filter((item) => item.label && item.title);

      return (
        <SiteTradeLowerSection
          glowColors={glowColors}
          whyHeading={String(d.whyHeading || '').trim()}
          whyItems={whyItems}
          typesHeading={String(d.typesHeading || '').trim()}
          typesIntro={String(d.typesIntro || '').trim()}
          types={types}
          whyHeadingTypography={cmsHeadlineTy(d, 'whyHeading')}
          typesHeadingTypography={cmsHeadlineTy(d, 'typesHeading')}
          typesIntroTypography={cmsParagraphTy(d, 'typesIntro')}
        />
      );
    }

    case 'site_line_pair_grid': {
      const raw = Array.isArray(d.items) ? d.items : [];
      const items = raw
        .map((row) => {
          const R = row as Record<string, string>;
          return {
            line1: String(R.line1 ?? '').trim(),
            line2: String(R.line2 ?? '').trim(),
          };
        })
        .filter((x) => x.line1);
      return (
        <SiteLinePairGridSection
          heading={String(d.heading || '').trim() || undefined}
          intro={String(d.intro || '').trim() || undefined}
          items={items}
          headingTypography={cmsHeadlineTy(d, 'heading')}
          introTypography={cmsParagraphTy(d, 'intro')}
        />
      );
    }

    case 'site_tag_cloud_row': {
      const raw = Array.isArray(d.tags) ? d.tags : [];
      const tags = raw
        .map((row) => String((row as Record<string, unknown>).text ?? '').trim())
        .filter(Boolean);
      return (
        <SiteTagCloudRowSection
          heading={String(d.heading || '').trim() || undefined}
          tags={tags}
          headingTypography={cmsHeadlineTy(d, 'heading')}
        />
      );
    }

    case 'site_stacked_tag_rows': {
      const raw = Array.isArray(d.rows) ? d.rows : [];
      const rows = raw.map((row) => {
        const text = String((row as Record<string, unknown>).tags ?? '');
        return text
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
      });
      return (
        <SiteStackedTagRowsSection
          heading={String(d.heading || '').trim() || undefined}
          rows={rows.filter((r) => r.length > 0)}
          headingTypography={cmsHeadlineTy(d, 'heading')}
        />
      );
    }

    case 'site_offerings_grid': {
      const raw = Array.isArray(d.items) ? d.items : [];
      const items = raw
        .map((row) => String((row as Record<string, unknown>).text ?? '').trim())
        .filter(Boolean);
      const wrap = String(d.wrapInCursorGlow ?? 'false') === 'true';
      return (
        <SiteOfferingsGridSection
          heading={String(d.heading || '').trim() || undefined}
          items={items}
          wrapInCursorGlow={wrap}
          glowPrimary={String(d.glowPrimary || '').trim() || undefined}
          glowSecondary={String(d.glowSecondary || '').trim() || undefined}
          glowTertiary={String(d.glowTertiary || '').trim() || undefined}
          headingTypography={cmsHeadlineTy(d, 'heading')}
        />
      );
    }

    case 'site_horizontal_pills': {
      const raw = Array.isArray(d.items) ? d.items : [];
      const items = raw
        .map((row) => String((row as Record<string, unknown>).text ?? '').trim())
        .filter(Boolean);
      return (
        <SiteHorizontalPillsSection
          heading={String(d.heading || '').trim() || undefined}
          items={items}
          variant={d.variant === 'compact' ? 'compact' : 'default'}
          headingTypography={cmsHeadlineTy(d, 'heading')}
        />
      );
    }

    case 'site_title_description_matrix': {
      const raw = Array.isArray(d.cells) ? d.cells : [];
      const cells = raw.map((row) => {
        const R = row as Record<string, string>;
        return {
          title: String(R.title ?? '').trim(),
          description: String(R.description ?? '').trim(),
        };
      });
      const pairs: { title: string; description: string }[][] = [];
      for (let i = 0; i < cells.length; i += 2) {
        pairs.push(cells.slice(i, i + 2));
      }
      return (
        <SiteTitleDescriptionMatrixSection
          heading={String(d.heading || '').trim() || undefined}
          intro={String(d.intro || '').trim() || undefined}
          rows={pairs.filter((row) => row.length > 0)}
          headingTypography={cmsHeadlineTy(d, 'heading')}
          introTypography={cmsParagraphTy(d, 'intro')}
        />
      );
    }

    case 'site_multiline_item_grid': {
      const raw = Array.isArray(d.items) ? d.items : [];
      const items = raw
        .map((row) => String((row as Record<string, unknown>).text ?? '').trim())
        .filter(Boolean);
      const cols = parseInt(String(d.columns ?? '6'), 10);
      const columns = cols === 2 || cols === 3 ? cols : 6;
      return (
        <SiteMultilineItemGridSection
          heading={String(d.heading || '').trim() || undefined}
          items={items}
          columns={columns as 2 | 3 | 6}
          headingTypography={cmsHeadlineTy(d, 'heading')}
        />
      );
    }

    case 'site_dark_prose':
      return (
        <SiteDarkProseSection
          heading={String(d.heading || '').trim() || undefined}
          body={String(d.body || '')}
          align={d.align === 'justify' ? 'justify' : 'center'}
          headingTypography={cmsHeadlineTy(d, 'heading')}
          bodyTypography={cmsParagraphTy(d, 'body')}
        />
      );

    case 'site_service_trades_footer':
      return <SiteServiceTradesFooterSection />;

    default:
      return null;
  }
}
