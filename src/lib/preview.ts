import {draftMode} from 'next/headers';
import {unstable_noStore as noStore} from 'next/cache';

export function readDraftModeState() {
  const {isEnabled} = draftMode();
  if (isEnabled) {
    noStore();
  }
  return isEnabled;
}
