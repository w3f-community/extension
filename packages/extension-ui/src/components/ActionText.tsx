// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

interface Props {
  icon?: string;
  text: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

function ActionText ({ icon, className, text, onClick }: Props): React.ReactElement<Props> {
  return (
    <div className={className} onClick={onClick}>
      {icon && <img src={icon} alt=''/>}
      <span>{text}</span>
    </div>
  );
}

export default styled(ActionText)`
  cursor: pointer;
  
  img {
    position: relative;
    top: 2px;
    width: 14px;
    height: 14px;
    margin-right: 6px;
  }
  
  span {
    font-size: ${({ theme }): string => theme.labelFontSize};
    line-height: ${({ theme }): string => theme.labelLineHeight};
    text-decoration-line: underline;
    color: ${({ theme }): string => theme.labelColor}
  }
`;
