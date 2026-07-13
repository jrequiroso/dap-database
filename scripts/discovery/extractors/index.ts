import { extractCayin } from './cayin';
import { extractFiio } from './fiio';
import { extractHiby } from './hiby';
import { extractHidizs } from './hidizs';
import { extractIbasso } from './ibasso';
import { extractQls } from './qls';
import { extractRetailer } from './retailer';
import { extractShanling } from './shanling';
import type { DiscoveredProduct, DiscoverySource } from '../types';

export function extractProducts(html: string, source: DiscoverySource): DiscoveredProduct[] {
  switch (source.extractor) {
    case 'fiio':
      return extractFiio(html, source);
    case 'shanling':
      return extractShanling(html, source);
    case 'ibasso':
      return extractIbasso(html, source);
    case 'cayin':
      return extractCayin(html, source);
    case 'hiby':
      return extractHiby(html, source);
    case 'hidizs':
      return extractHidizs(html, source);
    case 'qls':
      return extractQls(html, source);
    case 'retailer':
      return extractRetailer(html, source);
    default:
      return [];
  }
}
