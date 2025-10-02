import {NextResponse} from 'next/server';

import {findSlideshowById} from '@data/slideshows';

export async function GET(_: Request, context: {params: {id: string}}) {
  const slideshow = findSlideshowById(context.params.id);

  if (!slideshow) {
    return NextResponse.json({error: 'Slideshow not found'}, {status: 404});
  }

  return NextResponse.json({data: slideshow});
}
