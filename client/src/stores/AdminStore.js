// ������������ݵĴ洢����
import { defineStore } from 'pinia'//���� Pinia �� defineStore ����:

// ������Ϊ "admin" �� store���洢�Ͳ��������Ա��ص�״̬
export const AdminStore = defineStore("admin", {//export����� store �����������ļ��б������ʹ��
    state: () => { // ����store�ĳ�ʼ״̬
        return {
            id: 0, // id��ʼֵΪ0
            account: "", // account��ʼֵΪ���ַ���
            token: "" // token��ʼֵΪ���ַ���
        }
    },
    actions: {}, // ����store��actions������������
    getters: {} // ����store��getters���������ԣ�
})
/*
�־���: adminStore ͨ��ֻ��Ӧ������ʱ���ڣ��� localStorage �ṩ��Ự�ĳ־��Դ洢��
ʹ�ó���: adminStore �����ڴ洢�͹���ǰ�Ự����Ҫ��״̬��Ϣ��localStorage �����ڴ洢��Ҫ��Ự���������ݣ����û�ƫ�����û��ڶ���Ự�����õ���֤��Ϣ��
���ʷ�ʽ: adminStore ������ͨ����Ӧ���ڲ�ʹ�ã��� localStorage �����ݿ��Ա���������κ�ҳ�棨��ͬһ���£����ʡ�
*/