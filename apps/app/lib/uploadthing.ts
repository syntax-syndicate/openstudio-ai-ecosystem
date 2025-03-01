import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react';

import type { OurFileRouter } from '@/app/api/uploadthing/core';

export const UploadButton: any = generateUploadButton<OurFileRouter>();
export const UploadDropzone: any = generateUploadDropzone<OurFileRouter>();
