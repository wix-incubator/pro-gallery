import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import s from './App.scss';

/* <-- To remove demo stuff just copy-paste:
  \{?/\*\s?<--([\n\n]|.)*?-->\s?\*\/\}?
  to your search input with RegExp enabled and remove everything matched.
--> */

class App extends React.Component {
  static propTypes = {
    t: PropTypes.func,
  };

  /* <-- Feel free to remove this lifecycle hook and state */
  /* <-- Please also remove `yoshi-template-intro` from your package.json */
  state = {};
  async componentDidMount() {
    const { default: TemplateIntro } = await import('yoshi-template-intro');
    this.setState({ TemplateIntro });
  } /* --> */

  render() {
    const { t } = this.props;

    return (
      <div className={s.root}>
        <h2 className={s.title} data-hook="app-title">
          {t('app.title')}
        </h2>
        {/* <-- Feel free to remove TemplateIntro */}
        {this.state.TemplateIntro &&
          React.createElement(this.state.TemplateIntro)}
        {/* --> */}
      </div>
    );
  }
}

export default withTranslation()(App);
