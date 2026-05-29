# Precasterz — On-Page SEO Plan (canonical + title + meta description)

Domain: `https://precasterz.com`. Apply per page. Titles are keyword-led; descriptions ~150–160 chars, lead with the service/standard/deliverable (no marketing filler).

## Canonical tag pattern

Add ONE canonical to the `<head>` of every page, matching its own URL exactly (case-sensitive — note the home page uses the bare domain, and `Engineering-automation.html` is lowercase while the folder `Engineering-Automation/` is capitalised):

```html
<link rel="canonical" href="https://precasterz.com/PATH" />
```

## Per-page table

| Page (canonical URL) | `<title>` | meta description |
|---|---|---|
| https://precasterz.com/ | Precasterz \| Precast Concrete Design, Shop Drawings & Engineering Automation | Precasterz delivers precast concrete structural design, detailed shop drawings, BOQ/BBS, and in-house engineering automation to ACI 318-19 and Eurocode. |
| https://precasterz.com/services.html | Precast Engineering Services \| Design, Shop Drawings & Automation \| Precasterz | Our precast services: structural design reports, GA and shop drawings, BOQ/BBS preparation, and custom AutoCAD and ETABS automation tools. |
| https://precasterz.com/about.html | About Precasterz \| Specialist Precast Concrete Engineers | Precasterz is a specialist precast concrete engineering team focused on detailed design, shop drawings, and engineering automation for precast structures. |
| https://precasterz.com/careers.html | Careers \| Freelance Precast Engineers & Draftsmen \| Precasterz | Join Precasterz as a freelance civil engineer or draftsman on precast design and shop-drawing projects. Send your CV to careers@precasterz.com. |
| https://precasterz.com/contact.html | Contact Precasterz \| Precast Design & Shop Drawing Enquiries | Contact Precasterz for precast concrete design, shop drawings, BOQ/BBS, and automation enquiries. Email contact@precasterz.com to start a project. |
| https://precasterz.com/Achievements.html | Achievements \| In-House Precast Engineering Tools & Projects \| Precasterz | Precasterz milestones, including our HollowCoreSlab plugin for AutoCAD that automates precast slab layouts, openings, shop drawings, and BOQ export. |
| https://precasterz.com/services/Detailed-Design.html | Precast Detailed Design & GA Drawings \| Precasterz | Precast structural detailed design and general arrangement drawings: connection design, lifting analysis, and member design to ACI 318-19 and PCI. |
| https://precasterz.com/services/Detailed-Design/Lifting.html | Precast Lifting Design & Anchor Check (ACI 318-19) \| Precasterz | Precast lifting design: anchor selection, concrete breakout and shear checks to ACI 318-19, and rigging analysis for safe precast handling. |
| https://precasterz.com/services/Engineering-automation.html | Engineering Automation Tools for Precast Design \| Precasterz | Custom engineering automation for precast workflows: AutoCAD plugins, BOQ generation, ETABS load combinations, and calculation reporting tools. |
| https://precasterz.com/services/Engineering-Automation/Bills-of-Quantities.html | Precast BOQ Automation \| Bills of Quantities Tool \| Precasterz | Automated bill-of-quantities generation for precast elements — consistent BOQ output from design data, reducing manual take-off errors. |
| https://precasterz.com/services/Engineering-Automation/ETABS-Load-Combination.html | ETABS Load Combination Automation Tool \| Precasterz | Automate ETABS load combination generation to ASCE 7 / ACI 318-19 — fewer manual entries and consistent combinations for precast and concrete models. |
| https://precasterz.com/services/Engineering-Automation/Concise-Beam-Autoprinter.html | Concise Beam Autoprinter \| Batch Report Automation \| Precasterz | Automated batch printing of Concise Beam outputs for precast beam design — consistent calculation reports without manual page-by-page export. |
| https://precasterz.com/services/Engineering-Automation/HollowCoreSlab.html | HollowCoreSlab AutoCAD Plugin \| Precast Slab Automation \| Precasterz | The HollowCoreSlab plugin automates precast hollow core slab layouts, openings, shop drawings, and BOQ export inside AutoCAD. |
| https://precasterz.com/services/shop-drawings.html | Precast Shop Drawings \| Manholes, Foundations & More \| Precasterz | Detailed precast concrete shop drawings for manholes, foundations, and structural elements — fabrication-ready, standards-compliant detailing. |
| https://precasterz.com/services/shop-drawings/manholes.html | Precast Manhole Shop Drawings \| Precasterz | Fabrication-ready precast manhole shop drawings: reinforcement detailing, sections, lifting provisions, and BBS for precast manhole and chamber units. |
| https://precasterz.com/services/shop-drawings/foundation.html | Precast Foundation Shop Drawings \| Precasterz | Detailed precast foundation shop drawings: footing and pile-cap detailing, reinforcement layouts, embedded items, and bar bending schedules. |

## Notes
- Keep each `<title>` under ~60 characters of visible weight where possible; the table favours the keyword first so truncation still reads well.
- These descriptions are not a ranking factor directly but drive click-through from the results page — keep the lead phrase and the deliverable.
- After applying, re-check there is no leftover duplicate `<title>`/description (the Achievements page previously reused the Services copy — see audit H5).
- Place `sitemap.xml` and `robots.txt` at the site **root** (same level as `index.html`).

## Cowork prompt to apply this

> Using `seo-onpage-plan.md`:
> 1. Add `sitemap.xml` and `robots.txt` to the site root (use the provided files as-is).
> 2. On every page, set the `<title>` and `<meta name="description">` to the values in the table (replace existing ones; do not duplicate).
> 3. Add one `<link rel="canonical">` to each page's `<head>` matching its own canonical URL from the table — preserve exact case (`Engineering-automation.html` lowercase, `Engineering-Automation/` folder capitalised, `Achievements.html` capital A).
> Show me a diff per file before saving.
