import 'dotenv/config';
import App from './app';
import UserRoute from '@routes/user.route';
import ProductRoute from '@routes/product.route';
import AuthRoute from '@routes/auth.route';





const app = new App(
  [new UserRoute('/user'), new ProductRoute('/product'), new AuthRoute('/auth')],
 
);

app.listen();
