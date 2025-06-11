import * as v from 'valibot'
import { pageSpec } from './pagination'
import { parseSearchQuery } from '~/utils/search'
import { EventHandlerRequest, getValidatedQuery, H3Event } from 'h3'

export interface LicenseQuery {
  id?: string
  spdx?: string
  name?: string
}

export interface LicenseInfo {
  id: number,
  name: string,
  osi_approval: boolean
}

const searchLicenseSpec = v.object({
  ...pageSpec.entries,
  q: v.optional(
    v.pipe(
      v.string(),
      v.transform((v) => parseSearchQuery<LicenseQuery>(v, (q) => {
        let key: string
        switch (q.field) {
          case 'id':
            key = 'id'
            break
          case 'spdx':
            key = 'spdx'
            break
          case 'name':
          default:
            key = 'name'
        }

        return { [key]: q.value.value }
      }))
    )
  )
})

export type SearchLicenseQuery = v.InferOutput<typeof searchLicenseSpec>

export async function getSearchLicenseQuery (e: H3Event<EventHandlerRequest>): Promise<SearchLicenseQuery> {
  return getValidatedQuery<SearchLicenseQuery>(e, (value) => v.parse(searchLicenseSpec, value))
}
