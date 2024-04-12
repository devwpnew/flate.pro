import api from "./api/service/api"

const Sitemap = ({ e }) => {
  return e ? JSON.stringify(e) : null
}

export async function getServerSideProps({ res }) {
  try {
    require('dotenv').config()

    const sections = await api.get.sections()
    const resSections = prepateSitemapSections(sections)
    const productsSitemap = prepareSitemapProds(await api.get.product.list({filter: {published: 1}}))

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${process.env.DOMEN}/</loc>
            <lastmod>2022-12-14T15:52:00+03:00</lastmod>
        </url>
        <url>
            <loc>${process.env.DOMEN}/contacts</loc>
            <lastmod>2022-12-14T15:52:00+03:00</lastmod>
        </url>
        
        ${resSections.join("\r\n")}
        ${productsSitemap.join("\r\n")}
      </urlset>
    `

    //${productsSitemap != '' && productsSitemap}
    // ${productsSitemap}
    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()
    return {
      props: {}
    }
  } catch (e) {
    return {
      props: { e }
    }
  }

}

export default Sitemap

function prepateSitemapSections(sections) {
  const arrUrls = sections.map((section) => {
    return `<url>
      <loc>${process.env.DOMEN}/posts/${section.slug.replace('/&(?!#?[a-z0-9]+;)/g', '&amp;')}</loc>
      <lastmod>${section.date_edited ? section.date_edited : section.date_created}</lastmod>
    </url>`
  })
  return arrUrls;
}

function prepareSitemapProds(prods) {
  const arrUrls = prods.map((prod) => {
    const sectionUrlPart = prod.section_relation[0].slug.replace('/&(?!#?[a-z0-9]+;)/g', '&amp;')
    const productUrlPart = prod.slug.replace(/&/g, "&amp;")
    return `<url>
      <loc>${process.env.DOMEN}/posts/${sectionUrlPart}/${productUrlPart}</loc>
      <lastmod>${prod.date_edited ? prod.date_edited : prod.date_created}</lastmod>
    </url>`
  })
  return arrUrls;
}