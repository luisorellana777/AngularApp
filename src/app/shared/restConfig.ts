import { baseURL } from './baseurl';

export function RestangularConfigFatory(RestangularProvider) {
  RestangularProvider.setBaseUrl(baseURL);
}