import * as v from 'valibot'
import { pageSpec } from './pagination'
import { parseSearchQuery } from '~/utils/search'
import { EventHandlerRequest, getValidatedQuery, getRouterParam, H3Event, createError } from 'h3'

export interface LicenseQuery {
  id?: string
  spdx?: string
  name?: string
}

export interface LicenseInfo {
  id: number,
  name: string,
  spdx_identifier: string,
  osi_approval: boolean,
  license_text: string,
  webpage: string,
  obligation_disclosing_src: string,
  obligation_notification: string,
  obligation_including_license: string,
  created_at: string,
  modified_at: string,
  nicknames: string[]
}


export interface LicenseDetailQuery {
  id: string
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

const licenseDetailSpec = v.object({
  id: v.string()
})

export type LicenseDetailQuerySpec = v.InferOutput<typeof licenseDetailSpec>

export async function getLicenseDetailQuery (e: H3Event<EventHandlerRequest>): Promise<LicenseDetailQuery> {
  const id = getRouterParam(e, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'License ID is required'
    })
  }
  
  return { id }
}
