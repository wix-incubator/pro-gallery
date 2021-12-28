import React from 'react';

type PrintOnlySourceProps = React.SourceHTMLAttributes<HTMLSourceElement>;

export class PrintOnlyImageSource extends React.Component<
  PrintOnlySourceProps,
  { isPrinting: boolean }
> {
  constructor(props: PrintOnlySourceProps) {
    super(props);
    this.state = {
      isPrinting: false,
    };
  }

  componentDidMount(): void {
    window.addEventListener('beforeprint', () => {
      this.setState({ isPrinting: true });
    });
    window.addEventListener('afterprint', () => {
      this.setState({ isPrinting: false });
    });
  }

  render(): React.ReactNode {
    return this.state.isPrinting ? <source {...this.props} /> : null;
  }
}
