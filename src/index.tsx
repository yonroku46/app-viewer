import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "store/reducers";
import { AxiosClientProvider } from 'api/interceptors/AxiosClientProvider';
import App from 'App';

const store = createStore(rootReducer);
const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    // <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <AxiosClientProvider>
            <App/>
          </AxiosClientProvider>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
    // </React.StrictMode>
  );
}