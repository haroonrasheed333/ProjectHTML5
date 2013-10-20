from lxml import etree
import SimpleHTTPServer
import SocketServer
import json


class MyHTTPHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def do_POST(self):
        out = etree.parse("proj1.xml")
        feature_list = out.xpath("//Feature/Title/text()")
        #print feature_list
        browser_list = list(set(out.xpath("//Browser/Name/text()")))
        #print browser_list
        spec_list = out.xpath("//Spec/Name/text()")
        #print spec_list

        outputjson = dict()

        if self.path == '/':
            outputjson['feature_list'] = []
            outputjson['feature_list'].append(feature_list)

            outputjson['browser_list'] = []
            outputjson['browser_list'].append(browser_list)

            outputjson['spec_list'] = []
            outputjson['spec_list'].append(spec_list)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(outputjson))
            return
        elif self.path == '/queryxml':
            length = int(self.headers.getheader('content-length'))
            data = json.loads(self.rfile.read(length))
            print data
            browser = data['browser_name']
            feature = data['feature_name']

            if len(browser) > 0:
                xp = "//Spec[Browsers/Browser/Name = " + "'" + browser + "'"+ ']'
            elif len(feature) > 0:
                xp = "//Feature[Title = " + "'" + feature + "'"+ ']/Spec'

            specdetails = out.xpath(xp)

            outputsd = {}
            i = 0
            for sd in specdetails:
                spec_details = dict()
                spec_details['Name'] = ''
                spec_details['Description'] = ''
                spec_details['W3CLink'] = ''
                for c in sd.getchildren():
                    if c.tag != 'Browsers':
                        spec_details[c.tag] = c.text
                outputsd[i] = {}
                outputsd[i] = spec_details
                i += 1

            #outputjson['specdetails'] = []
            #outputjson['specdetails'].append(specdetails)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(outputsd))
            return


def main():
    out = etree.parse("proj1.xml")

    feature_list = out.xpath("//Feature/Title/text()")
    browsers = {}
    browser_list = list(set(out.xpath("//Browser/Name/text()")))
    spec_list = out.xpath("//Spec/Name/text()")

    browser = 'Safari'
    search_spec_for_browser = True
    if search_spec_for_browser:
       xp = "//Spec[Browsers/Browser/Name = " + "'" + browser + "'"+ ']/Name/text()'

    spec_details = dict()
    spec_details['Name'] = ''
    spec_details['Description'] = ''
    spec_details['W3CLink'] = ''
    spec_details['Browsers'] = []
    spec = 'File API'
    search_spec_details = True
    if search_spec_details:
        xp = "//Spec[Name = " + "'" + spec + "'"+']'
        specdetails = out.xpath(xp)
        for sd in specdetails:
            for c in sd.getchildren():
                if c.tag != 'Browsers':
                    spec_details[c.tag] = c.text
                elif c.tag == 'Browsers':
                    for b in c.getchildren():
                        tempbrow = dict()
                        for bb in b.getchildren():
                            tempbrow[bb.tag] = ''
                            tempbrow[bb.tag] = bb.text
                        spec_details['Browsers'].append(tempbrow)

    try:
        handler = MyHTTPHandler
        httpd = SocketServer.TCPServer(("", 8000), handler)
        print "serving at port", 8000
        httpd.serve_forever()
    except KeyboardInterrupt:
        print '^C received, shutting down server'
        httpd.socket.close()


if __name__ == '__main__':
    main()