import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import options from './options'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder(options)

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
