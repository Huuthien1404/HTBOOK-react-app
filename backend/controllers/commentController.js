const { query } = require("express");
const client = require("../config/api");

const commentController = {
    getAllCommentByProductController: (req, res) => {
        client.query(`SELECT "Username", "Content", "PostDate", "StarVote"
        FROM public."Comments" where "ProductID" = ${req.body.product_id};`, (err, results) => {
            if (err) throw err;
            for (let i of results.rows) {
                i.PostDate = new Date(i.PostDate.toString()).toLocaleString('vi-VN', {
                    timeZone: 'Asia/Ho_Chi_Minh'
                })
            }
            return res.json({
                data: results.rows
            })
        })
    },
    getEvaluateByProductController: (req, res) => {
        client.query(`select "StarVote", count("StarVote")
        from public."Comments"
        where "ProductID" = ${req.body.product_id}
        group by "StarVote"
        order by "StarVote";`, (err, results) => {
            prevResult = [
                {
                    StarVote: 1,
                    count: '0'
                },
                {
                    StarVote: 2,
                    count: '0'
                },
                {
                    StarVote: 3,
                    count: '0'
                },
                {
                    StarVote: 4,
                    count: '0'
                },
                {
                    StarVote: 5,
                    count: '0'
                }
            ]
            const newResult = [...prevResult, ...results.rows];
            const newData = [];
            let i = 5;
            while (i>0) {
                for (let j = newResult.length - 1; j >= 0; j--) {
                    if (newResult[j].StarVote == i) {
                        newData.push(newResult[j]);
                        break;
                    }
                }
                i-=1;
            }
            newData.sort((a, b) => a.StarVote - b.StarVote);
            if (err) throw err;
            return res.json({
                data: newData
            })
        })
    }
}

module.exports = commentController;