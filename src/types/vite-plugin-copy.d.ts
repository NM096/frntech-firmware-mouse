declare module 'vite-plugin-copy' {
  import { Plugin } from 'vite';

  interface CopyTarget {
    src: string;
    dest: string;
  }

  interface CopyOptions {
    targets: CopyTarget[];
  }

  export default function VitePluginCopy(options: CopyOptions): Plugin;
}
