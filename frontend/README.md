Setup with `npm install`.

Development work with `npm run dev`. Be sure to run this command in *this directory*.

Production build with `docker build . -t your-image-name-here`

Production deploy with `docker run -d --restart=always -p 53705:80 your-image-name-here`
