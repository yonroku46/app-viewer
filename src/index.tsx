import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { AxiosClientProvider } from 'api/interceptors/AxiosClientProvider';
import rootReducer from "redux/reducers";
import App from 'App';

const store = createStore(rootReducer);
const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    // <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <AxiosClientProvider>
            <App/>
          </AxiosClientProvider>
        </BrowserRouter>
      </Provider>
    // </React.StrictMode>
  );
}