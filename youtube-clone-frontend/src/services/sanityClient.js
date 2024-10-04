import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  useCdn: process.env.REACT_APP_SANITY_USE_CDN === 'true',
  apiVersion: process.env.REACT_APP_SANITY_API_VERSION,
})