import type { FC } from "hono/jsx";
import { containerClass, cardClass } from "../Layout";

type Props = {
  environment: string;
};

export const UrlBuilder: FC<Props> = ({ environment: _environment }) => {
  const scriptSrc = "/client/url-builder.js";

  return (
    <section id="builder" class={containerClass}>
      <h2>URLを作成</h2>
      <div class={cardClass}>
        <div id="url-builder-root">
          <noscript>JavaScriptを有効にしてください</noscript>
        </div>
      </div>
      <script type="module" src={scriptSrc}></script>
    </section>
  );
};
