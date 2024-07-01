#!/bin/sh
npm run build
npx prisma generate
npx prisma migrate dev --name init
npm run start:prod
