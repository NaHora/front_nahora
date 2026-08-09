import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  > svg {
    position: ${(props) => (props.fullScreen ? 'fixed' : 'absolute')};
    top: ${(props) => (props.fullScreen ? '20px' : '12px')};
    right: 20px;
    z-index: 5;
    color: #ff9000;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid rgba(11, 11, 11, 0.1);
    border-radius: 10px;
    padding: 6px;
    width: 34px;
    height: 34px;
    box-sizing: content-box;
  }

  > img {
    position: fixed;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid #ff9000;
    padding: 3px;
    background: #ffffff;
    bottom: 24px;
    right: 20px;
    z-index: 9;

    @media (max-width: 620px) {
      width: 40px;
      height: 40px;
      bottom: 16px;
      right: 12px;
    }
  }

  .Draftail-Editor {
    width: 100%;
    background-color: #ffffff !important;
    border: 1px solid rgba(11, 11, 11, 0.08);
    border-radius: 10px;
    color: #0b0b0b;
    padding: 0;
    align-self: center;
    overflow: hidden;
  }

  .Draftail-Toolbar {
    border-bottom: 1px solid rgba(11, 11, 11, 0.08);
    background-color: #f6f6fa;
    padding: 6px 8px;
    color: #0b0b0b;
    border-radius: 10px 10px 0 0;
    min-height: 44px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .Draftail-ToolbarGroup {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    & + .Draftail-ToolbarGroup {
      border-left: 1px solid rgba(11, 11, 11, 0.08);
      margin-left: 4px;
      padding-left: 8px;
    }
  }

  .Draftail-ToolbarButton {
    min-width: 34px;
    height: 34px;
    padding: 0 8px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    color: #0b0b0b;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(255, 144, 0, 0.12);
      color: #0b0b0b;
    }

    &[aria-pressed='true'],
    &.Draftail-ToolbarButton--active {
      background: #ff9000;
      color: #0b0b0b;
    }

    svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
  }

  .DraftEditor-root {
    padding: 16px 18px;
    font-size: ${(props) =>
      props.fullScreen ? 'clamp(20px, 5vw, 40px)' : '1rem'};
    color: #0b0b0b !important;
    min-height: ${(props) => (props.fullScreen ? '80vh' : '320px')};
    line-height: 1.6;
  }

  .public-DraftEditorPlaceholder-root {
    color: #a0aec0;
    padding: 16px 18px;
  }

  .Draftail-Editor--readonly .DraftEditor-editorContainer {
    opacity: 1 !important;
  }
`;
