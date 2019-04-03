import { SteedosSchema } from '../../src/types';
import { expect } from 'chai';

describe('自动生成字段名', () => {
  it('should return true', () => {
    let schema = new SteedosSchema({
        datasources: {
            default: {
                driver: "mongo",
                url: 'mongodb://127.0.0.1:27017/steedos',
                objects: {
                    post: {
                        fields: {
                            title: {
                                type: "text",
                                inlineHelpText: "fsdafas",
                                optionsFunction: function(){
                                    console.log('22222222222222222');
                                }
                            }
                        },
                        listeners: {
                            'default': {
                                beforeInsert: function(){
                                   console.log('beforeInsert......................');
                                },
                                beforeUpdate: function(){
                                    console.log('beforeUpdate......................');
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    let object = schema.getObject("post")
    // console.log(object)

    // let f1 = object.getField('title');
    // console.log(f1.type);

    let field = object.fields["title"]
    // console.log(field)
    
    expect(field.name).to.equal("title");

  });
});