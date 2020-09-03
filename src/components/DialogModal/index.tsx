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
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: 'black',
  },
  divButton: {
    display: 'flex',
    alignItems: 'center',
  },
}));

interface ComponentProps {
  text?: string;
  title?: string;
  onSubmit(): void;
  setOpenModal(bool: boolean): void;
  openModal: boolean;
}

const DialogModal: React.FC<ComponentProps> = ({
  text = '',
  title = '',
  onSubmit,
  setOpenModal,
  openModal,
}) => {
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
            <Button
              primaryColor="#ff9000"
              secondaryColor="#28262e"
              onClick={() => setOpenModal(false)}
              transparent
            >
              Cancelar
            </Button>
            <Button
              primaryColor="#ff9000"
              secondaryColor="#28262e"
              onClick={onSubmit}
              // loading={loading}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default DialogModal;
