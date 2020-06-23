import React from "react";

const SideBarButton = ({ isOpen, onClick, className }) => (
    <div className={className} style={styles.container} onClick={onClick}>
        {isOpen ? <div>X</div>:
            <div style={styles.barsContainer}>
                <div style={styles.bar}></div>
                <div style={styles.bar}></div>
                <div style={styles.bar}></div>
            </div>
        }
    </div>
)

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        fontSize: '16px',
    },
    barsContainer: {
        marginTop: '2px'
    },
    bar: {
        width: '16px',
        height: '1px',
        backgroundColor: 'white',
        marginBottom: '4px',
    }
}

export default SideBarButton;