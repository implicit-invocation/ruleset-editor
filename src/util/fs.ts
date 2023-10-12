import { BFSRequire, configure } from "browserfs";
import type { FSModule } from "browserfs/dist/node/core/FS";

let fs: FSModule | undefined = undefined;

const configureFs = (): Promise<FSModule> =>
  new Promise<FSModule>((resolve) => {
    configure(
      {
        fs: "IndexedDB",
        options: {},
      },
      function (e) {
        if (e) {
          // An error occurred.
          throw e;
        }
        // Otherwise, you can interact with the configured backends via our Node FS polyfill!
        fs = BFSRequire("fs");
        resolve(fs);
      }
    );
  });

export const getFs = async () => {
  if (fs) {
    return fs;
  }
  fs = await configureFs();
  return fs;
};
