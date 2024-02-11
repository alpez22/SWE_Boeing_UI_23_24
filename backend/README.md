Setup with `npm install`.

Development work with `npm run dev`. Be sure to run this command in *this directory*.

Production build with `docker build . -t your-image-name-here`

Production deploy with `docker run -d --restart=always -p 53706:53706 -v /your/mount/goes/here:/secrets your-image-name-here`
