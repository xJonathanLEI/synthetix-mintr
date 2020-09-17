import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import snxJSConnector from '../../helpers/snxJSConnector';
import { getEtherscanTxLink } from 'helpers/explorers';

import { hideTransaction } from '../../ducks/transactions';
import { getWalletDetails } from '../../ducks/wallet';

import Notification from './Notification';

const getStatusSentence = status => {
	switch (status) {
		case 'pending':
		default:
			return 'notification.status.pending';
		case 'success':
			return 'notification.status.success';
		case 'error':
			return 'notification.status.error';
	}
};

const TransactionNotification = ({ transaction, walletDetails, hideTransaction }) => {
	const { t } = useTranslation();
	const { networkId } = walletDetails;
	const [status, setStatus] = useState(transaction.status);
	useEffect(() => {
		const getTransactionTicket = async () => {
			const status = await snxJSConnector.utils.waitForTransaction(transaction.hash);
			setStatus(status ? 'success' : 'error');
			return () => setStatus(null);
		};
		getTransactionTicket();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Notification
			key={1}
			isPending={status === 'pending'}
			icon={'/images/success.svg'}
			heading={t(getStatusSentence(status))}
			description={transaction.info}
			link={getEtherscanTxLink(networkId, transaction.hash)}
			linkLabel={t('button.navigation.view')}
			onClose={() => hideTransaction(transaction.hash)}
		/>
	);
};

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {
	hideTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionNotification);
