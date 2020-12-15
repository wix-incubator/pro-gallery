import React from 'react';

export class LayoutFixer extends React.Component {
  render() {
    return this.props.layoutFixerBundleUrl ? (
      <div
        id={'layout-fixer-' + this.props.domId}
        key={'layout-fixer-' + this.props.domId}
        style={{ display: 'none' }}
      >
        <style id={'layout-fixer-style-' + this.props.domId}></style>
        {this.props.isPrerenderMode ? (
          <>
            {this.props.layoutFixerScriptType === 'preload' && (
              <link
                rel="preload"
                href={this.props.layoutFixerBundleUrl}
                as="script"
              />
            )}
            <script
              dangerouslySetInnerHTML={{
                __html: `console.log("[LAYOUT FIXER] Start (first script loaded)")`,
              }}
            ></script>
            {this.props.layoutFixerScriptType === 'async' ||
              (this.props.layoutFixerScriptType === 'preload' && (
                <script
                  async
                  type="module"
                  src={this.props.layoutFixerBundleUrl}
                ></script>
              ))}
            {this.props.layoutFixerScriptType === 'defer' && (
              <script defer src={this.props.layoutFixerBundleUrl}></script>
            )}
            {this.props.layoutFixerScriptType !== 'async' &&
              this.props.layoutFixerScriptType !== 'defer' &&
              this.props.layoutFixerScriptType !== 'preload' && (
                <script src={this.props.layoutFixerBundleUrl}></script>
              )}
            <layout-fixer
              domId={this.props.domId}
              items={JSON.stringify(this.props.items)}
              styles={JSON.stringify(this.props.styles)}
            ></layout-fixer>
          </>
        ) : null}
      </div>
    ) : null;
  }
}
