import { Popover, Typography } from '@mui/material';

const LogPopover = (props) => {

    const { open, onClose, children, anchorEl } = props;

    <Popover
        id={props.id}
        open={open}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
    >
        {children}
    </Popover>
}

export default LogPopover;