import styled from 'styled-components'

export default function ToggleSwitch({ isOn, handleToggle }) {
  return (
    <SwitchWrapper>
      <Label>영어 번역</Label>
      <SwitchLabel>
        <HiddenCheckbox type="checkbox" checked={isOn} onChange={handleToggle} />
        <Slider $isOn={isOn} />
      </SwitchLabel>
    </SwitchWrapper>
  );
}
const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-size: 14px;
`;

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
`;

const HiddenCheckbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ $isOn }) => ($isOn ? '#FFD700' : '#ccc')};
  transition: 0.4s;
  border-radius: 34px;

  &::before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${({ $isOn }) => ($isOn ? 'translateX(18px)' : 'translateX(0)')};
  }
`;
