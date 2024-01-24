//��ƪ���������������ݿ�SQlite����
const sqlite3 = require("sqlite3").verbose(); // ������SQLite���ݿ⽻����Node.jsģ��
const path = require("path"); // �������������ļ�ϵͳ·����ģ��
const GenId = require("../utils/SnowFlake"); // �����Զ����ѩ��SnowFlakeģ�飬��������ΨһID

//�������ݿ����
var db = new sqlite3.Database(path.join(__dirname, "blog.sqlite3"));//ʹ��sqlite3.Database����һ�����ӵ�blog.sqlite3���ݿ��ļ��Ķ���
const genid = new GenId({ WorkerId: 1 }); // WorkerId=1������������ʱ������id�ظ��� ����һ��SnowFlake������������ΨһID

//�첽������װ
db.async = {};// һ����װ�˶����ݿ���첽�������¶���

// ��װdb.all���첽SQL��ѯ
db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {//����һ��Promise����
        // ����db.all����ִ�в�ѯ����
        db.all(sql, params, (err, rows) => {//�ص�����
            resolve({ err, rows }); // ����ѯ�������
        });
    });
};

// ��װdb.run���첽SQL����
db.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        // ����db.run����ִ�и��²���
        db.run(sql, params, (err, rows) => {//�첽��ִ��SQL���²���
            resolve({ err, rows }); // �����½������
        });
    });
};

module.exports = { db, genid }; // ����db�����genid����ʹ������������ط�ʹ��