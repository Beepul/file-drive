import { ConvexError, v } from 'convex/values'
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server'
import { getUser } from './users'


export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if(!identity){
        throw new ConvexError('Your must be loggedin to upload a file.')
    }

    return await ctx.storage.generateUploadUrl()
})

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
    const user = await getUser(ctx, tokenIdentifier)

    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

    return hasAccess
}

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id('_storage'),
        orgId: v.string()
    },
    async handler(ctx, args){

        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new ConvexError('Your must be loggedin to upload a file.')
        }

        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)

        if(!hasAccess){
            throw new ConvexError('you do not have access to this org')
        }

        await ctx.db.insert('files', {
            name: args.name,
            fileId: args.fileId,
            orgId: args.orgId
        })
    }
})


export const getFiles = query({
    args: {
        orgId: v.string()
    },
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity()

        console.log(identity)

        if(!identity){
            return []
        }

        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)

        if(!hasAccess){
            return []
        }

        return ctx.db.query('files').withIndex('by_orgId', (q) =>{
            return q.eq('orgId',args.orgId)
        }).collect()
    }
})