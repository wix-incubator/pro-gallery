import React, { Component } from 'react';

import { imagePath } from '../../utils/assetUtils';
import styles from './about.module.scss';

class About extends Component {
  render() {
    return (
      <div>
        <h1 className={styles.title}>About page</h1>
        <img className={styles.reactLogo} src={imagePath('react.svg')} alt="" />
      </div>
    );
  }
}

export default About;
