/* @flow */
/* **********************************************************
* File: src/micaConstants.js
*
* Brief: Constants for MICA taken from packets.h
* Author: Craig Cheney
* Date: 2018.10.18
*
********************************************************* */

export const VERSION = (0x0104);/** < Version of the packet protocol, MSB -> Major, LSB -> Minor */

/* **** FRAME DEFINITIONS **** */
export const LEN_SYM_START = (1); /** < Length of the Start of Packet Symbol */
export const LEN_PAYLOAD_LEN = (2); /** < Length of the Payload Length */
export const LEN_FLAGS = (2); /** < Length of the flags  */
export const LEN_CMD = (1); /** < Length of the Command */
export const LEN_CHECKSUM = (2); /** < Length of the checksum */
export const LEN_SYM_END = (1); /** < Length of the End of Packet Symbol */
export const LEN_HEADER = (LEN_SYM_START + LEN_PAYLOAD_LEN + LEN_CMD); /** < Length of the packet overhead, for checksum validation */
export const LEN_FOOTER = (LEN_FLAGS + LEN_CHECKSUM + LEN_SYM_END); /** < Length of the footer */
export const LEN_OVERHEAD = (LEN_HEADER + LEN_FOOTER); /** < Total length of the packet overhead */
export const LEN_MAX_PAYLOAD = (256); /** < Maximum length of the payload */
export const LEN_MAX_PACKET = (LEN_OVERHEAD + LEN_MAX_PAYLOAD); /** < Maximum length of the entire packet */

export const LEN_PAYLOAD_128 = (0x80);
export const LEN_PACKET_128 = (LEN_OVERHEAD + LEN_PAYLOAD_128);

export const INDEX_START = (0); /** < Index of the start of packet symbol */
export const INDEX_CMD = (1); /** < Index of the command to issue */
export const INDEX_LEN_MSB = (2); /** < Index of the Payload length MSB */
export const INDEX_LEN_LSB = (3); /** < Index of the Payload length LSB */
export const INDEX_PAYLOAD = (4); /** < Index of the packet Payload */

/* **** SYMBOL DEFINITIONS **** */
export const SYM_START = (0x01); /** < Start of Packet Symbol. All packets must begin with this symbol */
export const SYM_END = (0xAA); /** < End of Packet Symbol. All packets must end with this symbol */

/* **** MODULE IDS **** */
export const ID_MODULE_CONTROL = (0); /** < ID of the Control Module */
export const ID_MODULE_ACTUATION = (1); /** < ID of the Actuation Module */
export const ID_MODULE_SENSING = (2); /** < ID of the Sensing Module */
export const ID_MODULE_ENERGY = (3); /** < ID of the Energy Module */
export const ID_MODULE_MAX = (3); /** < Maximum value allowed */


/* **** PROCESSING ERROR FLAGS **** */
export const ERR_SHIFT_MEMORY = (0); /** < Failed to allocate memory */
export const ERR_SHIFT_START_SYM = (1); /** < Incorrect start symbol was received */
export const ERR_SHIFT_END_SYM = (2); /** < Incorrect end symbol was received */
export const ERR_SHIFT_LENGTH = (3); /** < The amount of data available is outside the expected range. */
export const ERR_SHIFT_FORMAT = (4); /** < The packet is not in the correct format */
export const ERR_SHIFT_INCOMPLETE = (5); /** < The packet cannot be processed as it is incomplete */
//    export const ERR_SHIFT_MODULE           = (6);     /**< An invalid module was specified */
export const ERR_SHIFT_DATA = (7); /** < The data is not of the proper form  */
export const ERR_SHIFT_CMD = (8); /** < The command is not recognized */
export const ERR_SHIFT_CHECKSUM = (9); /** < The packet checksum does not match the expected value */
export const ERR_SHIFT_STATE = (10); /** < Device was in the incorrect state to execute the command */
export const ERR_SHIFT_DEVICE = (11); /** < An Unknown device was addressed */
export const ERR_SHIFT_CALLBACK = (12); /** < An invalid callback was attempted */
export const ERR_SHIFT_UNKNOWN = (31); /** < An unknown error occurred - End of error space */

export const ERR_SUCCESS = (0x00); /** < Returned Success */
export const ERR_MEMORY = (1 << ERR_SHIFT_MEMORY); /** < Failed to allocate memory */
export const ERR_START_SYM = (1 << ERR_SHIFT_START_SYM); /** < Incorrect start symbol was received */
export const ERR_END_SYM = (1 << ERR_SHIFT_END_SYM); /** < Incorrect end symbol was received */
export const ERR_LENGTH = (1 << ERR_SHIFT_LENGTH); /** < The amount of data available is outside the expected range. */
export const ERR_FORMAT = (1 << ERR_SHIFT_FORMAT); /** < The packet is not in the correct format */
export const ERR_INCOMPLETE = (1 << ERR_SHIFT_INCOMPLETE); /** < The packet cannot be processed as it is incomplete */
//    export const ERR_MODULE                 = (1 << ERR_SHIFT_MODULE);    /**< An invalid module was specified */
export const ERR_DATA = (1 << ERR_SHIFT_DATA); /** < The data is not of the proper form  */
export const ERR_CMD = (1 << ERR_SHIFT_CMD); /** < The command is not recognized */
export const ERR_CHECKSUM = (1 << ERR_SHIFT_CHECKSUM); /** < The packet checksum does not match the expected value */
export const ERR_STATE = (1 << ERR_SHIFT_STATE); /** < Device was in the incorrect state to execute the command */
export const ERR_DEVICE = (1 << ERR_SHIFT_DEVICE); /** < An Unknown device was addressed */
export const ERR_CALLBACK = (1 << ERR_SHIFT_CALLBACK); /** < An invalid callback was attempted */
export const ERR_UNKNOWN = (1 << ERR_SHIFT_UNKNOWN); /** < An unknown error occurred - End of error space */


/* **** PACKET FLAGS **** */
export const FLAG_SHIFT_ACK = (0); /** < This packet is acknowledging the previous command */
export const FLAG_SHIFT_NO_ACK = (1); /** < The target device is not required to ACK the command */
export const FLAG_SHIFT_INVALID_CMD = (2); /** < The passed command was invalid */

export const FLAG_ACK = (1 << FLAG_SHIFT_ACK); /** < This packet is acknowledging the previous command */
export const FLAG_NO_ACK = (1 << FLAG_SHIFT_NO_ACK); /** < The target device is not required to ACK the command  */
export const FLAG_INVALID_CMD = (1 << FLAG_SHIFT_INVALID_CMD); /** < The passed command was invalid  */

/* **** COMMAND SPACE **** */
export const CMD_MIN = (0x00); /** < Start of the host command space */
export const CMD_MAX = (0x7F); /** < End of the host command space */
export const CMD_CONTROL_MIN = (0x00); /** < Start of the host control command space */
export const CMD_CONTROL_MAX = (0x1F); /** < End of the host control command space */
export const CMD_ACTUATION_MIN = (0x20); /** < Start of the host actuation command space */
export const CMD_ACTUATION_MAX = (0x3F); /** < End of the host actuation command space */
export const CMD_SENSING_MIN = (0x40); /** < Start of the host sensing command space */
export const CMD_SENSING_MAX = (0x5F); /** < End of the host sensing command space */
export const CMD_ENERGY_MIN = (0x60); /** < Start of the host energy command space */
export const CMD_ENERGY_MAX = (0x7F); /** < End of the host energy command space */

export const CMD_ID = (0x00); /** < Request the ID of a device */

/* **** RESPONSE SPACE **** */
export const RSP_MIN = (0x80); /** < Start of the response command space */
export const RSP_MAX = (0xFF); /** < End of the response command space */
export const RSP_CONTROL_MIN = (0x80); /** < Start of the host control command space */
export const RSP_CONTROL_MAX = (0x9F); /** < End of the host control command space */
export const RSP_ACTUATION_MIN = (0xA0); /** < Start of the host actuation command space */
export const RSP_ACTUATION_MAX = (0xBF); /** < End of the host actuation command space */
export const RSP_SENSING_MIN = (0xC0); /** < Start of the host sensing command space */
export const RSP_SENSING_MAX = (0xDF); /** < End of the host sensing command space */
export const RSP_ENERGY_MIN = (0xE0); /** < Start of the host energy command space */
export const RSP_ENERGY_MAX = (0xFF); /** < End of the host energy command space */

export const RSP_BIT_SHIFT = 7; /** < Shift of the bit that indicates the packet contains a response */
export const RSP_BIT = (1 << RSP_BIT_SHIFT); /** < Bit that indicates the packet contains a response */


/* [] - END OF FILE */
