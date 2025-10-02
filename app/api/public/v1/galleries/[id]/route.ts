import {NextResponse} from 'next/server';

import {findGalleryById} from '@data/galleries';

export async function GET(_: Request, context: {params: {id: string}}) {
  const gallery = findGalleryById(context.params.id);

  if (!gallery) {
    return NextResponse.json({error: 'Gallery not found'}, {status: 404});
  }

  return NextResponse.json({data: gallery});
}
