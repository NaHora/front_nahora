import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '../Button';
// import { Container } from './styles';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  paper: {
    backgroundColor: '#ffffff',
    border: '1px solid rgba(11, 11, 11, 0.08)',
    borderRadius: 12,
    boxShadow: '0 30px 60px rgba(7, 17, 31, 0.28)',
    padding: 24,
    color: '#0b0b0b',
    width: 'min(420px, calc(100vw - 32px))',
    outline: 'none',
  },
  divButton: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 20,
  },
  buttonWrap: {
    flex: '1 1 140px',
    minWidth: 0,
    '& > button': {
      marginTop: 0,
    },
  },
}));

interface ComponentProps {
  text?: string;
  title?: string;
  onSubmit(): void;
  setOpenModal(bool: boolean): void;
  openModal: boolean;
}

function DialogModal({
  text = '',
  title = '',
  onSubmit,
  setOpenModal,
  openModal,
}: ComponentProps) {
  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={openModal}
      onClose={() => setOpenModal(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <div className={classes.paper}>
          <h2 id="transition-modal-title"> {title || 'Deseja excluir?'} </h2>
          <p id="transition-modal-description">
            {text || 'Ao continuar o item será excluído.'}
          </p>
          <div className={classes.divButton}>
            <div className={classes.buttonWrap}>
              <Button
                primaryColor="#ff9000"
                secondaryColor="#28262e"
                onClick={() => setOpenModal(false)}
                transparent
              >
                Cancelar
              </Button>
            </div>
            <div className={classes.buttonWrap}>
              <Button
                primaryColor="#ff9000"
                secondaryColor="#d54c46"
                onClick={() => {
                  onSubmit();
                  setOpenModal(false);
                }}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default DialogModal;
