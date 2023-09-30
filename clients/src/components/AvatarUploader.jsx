import PropTypes from 'prop-types';
import {styled} from '@mui/material';
import { StyledComponent } from '@mui/material';
// import { keyframes } from '@mui/material';
import { HiOutlineRefresh } from 'react-icons/hi';
import { useState, useCallback } from 'react';

function AvatarUploader({ error, isLoading, avatar, onGenerate }) {
  return (
    <Wrapper>
      <AvatarBox>
        {avatar ? (
          <AvatarImage
            error={error}
            isLoading={isLoading}
            src={`data:image/svg+xml;base64,${avatar}`}
            alt="user-avatar"
          />
        ) : <defaultImage/>}
      </AvatarBox>
      <GenerateButton onClick={onGenerate}>
        <IconWrapper isLoading={isLoading}>
          <HiOutlineRefresh />
        </IconWrapper>
        <ButtonText>{error ? 'Please try again later' : isLoading ? 'Generating...' : 'Generate a Profile Avatar by clicking here '}</ButtonText>
      </GenerateButton>
    </Wrapper>
  );
}

AvatarUploader.propTypes = {
  error: PropTypes.object,
  isLoading: PropTypes.bool,
  avatar: PropTypes.string,
  onGenerate: PropTypes.func
};

const Wrapper = styled('div')`
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  width: 80%;
  gap: 1rem;
`;

const AvatarBox = styled('div')`
  display: block;
  width: 150px;
  height: 150px;
  border-radius: 4px;
  background-color: var(--bg-color-darken);
  padding: 0.5rem;
`;

const AvatarImage = styled('img')`
  
  animation-fill-mode: ${(props) => (props.error ? 'backwards' : 'forwards')};
`;

const defaultImage = styled('img')`
  background-image:URL('https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg')
`;

const GenerateButton = styled('button')`
  flex: 1;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  background-color: var(--bg-color-main);
  border-radius: 4px;
  border: 1.5px solid var(--primary);
  padding: 0.5rem;
  cursor: pointer;
  filter: saturate(90%);

  &:hover {
    background-color: var(--bg-color-darken);
  }
`;

// const rotate = keyframes`
//   from {
//     transform: rotate(0deg);
//   }

//   to {
//     transform: rotate(360deg);
//   }
// `;

const IconWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 0.5rem;
  color: var(--primary);
  font-weight: 900;
`;

const ButtonText = styled('p')`
  text-align: start;
  color: #fff;
`;

export default AvatarUploader;