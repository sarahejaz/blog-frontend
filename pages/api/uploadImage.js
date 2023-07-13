import { createRouter } from 'next-connect';
import multer from 'multer';

// Default Req and Res are IncomingMessage and ServerResponse
// You may want to pass in NextApiRequest and NextApiResponse

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads', // destination folder
    filename: (req, file, cb) => cb(null, getFileName(file)),
  }),
});

const getFileName = (file) => {
  let filename = file.originalname + '-' + new Date().getTime();
  filename +=
    '.' +
    file.originalname.substring(
      file.originalname.lastIndexOf('.') + 1,
      file.originalname.length
    );
  return filename;
};

const router = createRouter();

router
  .use(async (req, res, next) => {
    await next(); // call next in chain
    // const end = Date.now();
    // console.log(`Request took ${end - start}ms`);
  })
  .post(async (req, res) => {
    upload.array('file');
    res.status(401).send({ message: 'Invalid email or password' });
  });

// create a handler from router with custom
// onError and onNoMatch
export default router.handler({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});
