import { fetchBankData, saveBankData } from '@/services/bankService';
import { getResponse } from 'utils/utils';

export default {
  namespace: 'enterpriseBank',

  state: {
    bankList: [],
  },

  effects: {
    *queryBankAccount({ payload }, { call, put }) {
      // const { ...params } = payload;
      const bankAccountData = getResponse(yield call(fetchBankData, payload));
      if (bankAccountData) {
        yield put({
          type: 'updateState',
          payload: {
            bankList: bankAccountData,
          },
        });
      }
    },
    *saveBankAccount({ payload }, { call }) {
      const bankAccountData = getResponse(yield call(saveBankData, payload));
      return bankAccountData;
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
