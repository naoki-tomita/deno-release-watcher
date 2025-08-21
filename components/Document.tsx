import React, {
  createElement,
  FC,
  ReactNode,
} from "https://esm.sh/react@19.1.1";
const h = createElement;

export const Document: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html>
      <head>
        <title>KV App</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};
